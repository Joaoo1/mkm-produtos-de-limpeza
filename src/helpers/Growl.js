export function successMsg(growl, summary, life) {
  growl.current.show({
    life: life || 3000,
    summary,
    severity: 'success',
  });
}

export function errorMsg(growl, summary, life) {
  growl.current.show({
    summary,
    severity: 'error',
    life: life || 5000,
  });
}

export function infoMsg(growl, summary, life) {
  growl.current.show({
    life: life || 5000,
    summary,
    severity: 'info',
  });
}
