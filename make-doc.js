const { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item === 'node_modules' || item === '.next' || item === '.git') continue;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) getFiles(full, files);
    else if (/\.(tsx|ts|css)$/.test(item)) files.push(full);
  }
  return files.sort();
}

const files = getFiles('src');
const children = [];

// 표지
children.push(new Paragraph({
  text: 'CDP MAP Lounge - 전체 소스코드',
  heading: HeadingLevel.TITLE,
}));
children.push(new Paragraph({
  children: [new TextRun({
    text: '※ Ctrl+F 또는 왼쪽 목차에서 파일 경로를 찾아 코드를 수정한 후, 사용자님께 파일경로 + 전체코드를 전달해주세요.',
    size: 20,
  })]
}));
children.push(new Paragraph({ children: [new PageBreak()] }));

for (const filepath of files) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');

    // 파일 경로를 Heading 1로 (목차에 표시됨)
    children.push(new Paragraph({
      text: filepath,
      heading: HeadingLevel.HEADING_1,
    }));

    // 코드 내용 (줄별로)
    const lines = content.split('\n');
    for (const line of lines) {
      children.push(new Paragraph({
        children: [new TextRun({
          text: line,
          font: 'Courier New',
          size: 16,
        })]
      }));
    }

    children.push(new Paragraph({ children: [new PageBreak()] }));
  } catch (e) {
    console.error(`오류: ${filepath}`, e.message);
  }
}

const doc = new Document({ sections: [{ children }] });

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/mnt/user-data/outputs/cdp-map-lounge-code.docx', buf);
  console.log('완료!');
});
