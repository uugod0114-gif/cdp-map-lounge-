var SECRET = "cdpmap-survey-2026";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.secret !== SECRET) return json({ ok: false, error: "unauthorized" });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var type = data.type;
    var role = data.role;

    if (type === "lecture") {
      var sheetName = role + " - 강의별평가";
      var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(["제출시각","참여유형","강의번호","강의명","이해도","난이도","실용성","구성흐름","다시듣고싶은정도","좋았던점","기억에남는점","어려웠던점"]);
      }
      sheet.appendRow([new Date(), role, data.lectureId, data.lectureTitle, data.rating, data.difficulty, data.utility, data.flow, data.replay, data.good, data.memo, data.hard]);

    } else if (type === "overall") {
      var sheet2 = ss.getSheetByName("수강 - 전체평가") || ss.insertSheet("수강 - 전체평가");
      if (sheet2.getLastRow() === 0) {
        sheet2.appendRow(["제출시각","전체만족도","목표달성도","PM과제적용내용","셀프평가","좋았던점","보완할점","과제개선계획"]);
      }
      sheet2.appendRow([new Date(), data.overallRating, data.goalMet, data.pmRole, data.selfCheck, data.goodPoint, data.improvePoint, data.nextPlan]);

    } else if (type === "overall_audit") {
      var sheet3 = ss.getSheetByName("청강 - 전체평가") || ss.insertSheet("청강 - 전체평가");
      if (sheet3.getLastRow() === 0) {
        sheet3.appendRow(["제출시각","전체만족도","현업적용가능","적용내용","추천여부","좋았던점","보완할점"]);
      }
      sheet3.appendRow([new Date(), data.auditRating, data.applyable, data.applyDetail, data.recommend, data.auditGood, data.auditToStaff]);

    } else if (type === "overall_course") {
      // 26년 하반기 CDP MAP 전체 교육 과정(1~5회차) 만족도 설문
      var sheet4 = ss.getSheetByName("전체과정") || ss.insertSheet("전체과정");
      if (sheet4.getLastRow() === 0) {
        sheet4.appendRow(["제출시각","참여유형","PM직무준비도움정도","가장만족스러운점","부족한주제/추가요청","PM직무적용계획","운영진에게하는말","BestOfBest강의"]);
      }
      var bestLecturesText = Array.isArray(data.bestLectures) ? data.bestLectures.join(", ") : (data.bestLectures || "");
      sheet4.appendRow([new Date(), role, data.courseHelpful, data.favoritePart, data.lackingTopics, data.applyPlan, data.messageToStaff, bestLecturesText]);

    } else if (type === "attendance") {
      var sheetA = ss.getSheetByName("출석") || ss.insertSheet("출석");
      if (sheetA.getLastRow() === 0) {
        sheetA.appendRow(["제출시각", "회차", "참여유형", "소속", "이름"]);
      }
      sheetA.appendRow([new Date(), data.session, data.role, data.dept, data.name]);
    }

    return json({ ok: true });
  } catch(err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
