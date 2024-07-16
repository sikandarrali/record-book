export const isStringUrdu = (text) =>{
    const urduRegex = /[\u0600-\u06FF]/;
    return urduRegex.test(text);
}