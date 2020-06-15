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
    life: 5000,
  });
}

export function infoMsg(growl, summary, title) {
  growl.current.show({
    title,
    summary,
    severity: 'info',
  });
}
