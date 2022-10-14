// @ts-check

export async function handler() {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject('timeout');
    }, 60000);
  });
}
