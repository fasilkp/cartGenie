export default function(coupon, price){
  if(!coupon){
    return {
      error: true
    }
  }
      if (price < coupon.minAmount) {
        return {
          error: true
        }
      }
      let discountAmount = (price * coupon.discount) / 100;
    
      if (discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
      return {
        price,
        error: false,
        couponPrice: Math.floor(discountAmount)
      }
}