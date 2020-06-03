export function successMsg(growl, summary, title) {
  growl.current.show({
    title,
    summary,
    severity: 'success',
  });
}

export function errorMsg(growl, summary, title) {
  growl.current.show({
    title,
    summary,
    severity: 'error',
  });
}

export function infoMsg(growl, summary, title) {
  growl.current.show({
    title,
    summary,
    severity: 'info',
  });
}
