// src/lib/utils/helpers.js

/**
 * 날짜를 읽기 쉬운 문자열로 포맷합니다.
 * @param {Date | string | number} dateInput
 * @returns {string}
 */
export function formatDate(dateInput) {
    const date = new Date(dateInput);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }
  
  /**
   * 주어진 텍스트를 일정 길이로 자르고 '...'을 붙입니다.
   * @param {string} text
   * @param {number} [maxLength=100]
   * @returns {string}
   */
  export function truncateText(text, maxLength = 100) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }
  