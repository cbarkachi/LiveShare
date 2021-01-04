export default function formattedPrice(price, showDollar, showDecimal, omitHr) {
  const priceStr = price.toString();
  const amount = `${priceStr.substring(0, priceStr.length - 2)}`;
  const formattedPrice = `${showDollar ? "$" : ""}${amount}${
    showDecimal ? ".00" : ""
  }${omitHr ? "" : "/hr"}`;
  return formattedPrice;
}
