// 이나 돌잔치 초대장: 방명록·참석 여부 저장용 Google Apps Script
// 이 코드를 붙여 넣을 스프레드시트에 '방명록', '참석' 시트가 자동으로 만들어진다.

function sheet_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(header); sh.setFrozenRows(1); }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(s, max) {
  return String(s || '').replace(/[\u0000-\u0008\u000B-\u001F]/g, '').trim().slice(0, max);
}

// 방명록 목록 (숨김 칸에 무엇이든 적으면 페이지에서 감춰진다)
function doGet(e) {
  if ((e.parameter.action || '') !== 'list') return json_({ ok: false, error: 'unknown action' });
  const sh = sheet_('방명록', ['시간', '이름', '메시지', '숨김']);
  const rows = sh.getDataRange().getValues().slice(1);
  const items = rows.filter(r => !r[3]).map(r => ({ time: r[0], name: r[1], message: r[2] })).reverse();
  return json_({ ok: true, items });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    if (d.action === 'message') {
      const name = clean_(d.name, 20), message = clean_(d.message, 300);
      if (!name || !message) return json_({ ok: false, error: 'empty' });
      sheet_('방명록', ['시간', '이름', '메시지', '숨김']).appendRow([new Date(), name, message, '']);
      return json_({ ok: true });
    }
    if (d.action === 'rsvp') {
      const name = clean_(d.name, 20);
      if (!name) return json_({ ok: false, error: 'empty' });
      const count = Math.max(1, Math.min(20, parseInt(d.count, 10) || 1));
      sheet_('참석', ['시간', '이름', '참석 여부', '인원', '메모']).appendRow([new Date(), name, clean_(d.attend, 4), count, clean_(d.memo, 100)]);
      return json_({ ok: true });
    }
    return json_({ ok: false, error: 'unknown action' });
  } finally {
    lock.releaseLock();
  }
}
