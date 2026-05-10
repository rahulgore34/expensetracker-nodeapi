module.exports = (req, res, next) => {
    const expenseName =
        req.body.expenseName?.toLowerCase() || '';

    let category = 'Other';
    const foodKeywords = ['pizza', 'burger', 'hotel', 'food','breakfast'];
    const travelKeywords = ['uber', 'ola', 'petrol', 'diesel'];
    const shoppingKeywords = ['amazon', 'flipkart','meesho','dmart'];
    const billsKeywords = ['electricity', 'recharge', 'bill', 'rent', 'subscription'];
    // Food
    if (foodKeywords.some(keyword => expenseName.includes(keyword))) {
        category = 'Food';
    }

    // Travel
    else if (travelKeywords.some(keyword => expenseName.includes(keyword))) {
        category = 'Travel';
    }

    // Shopping
    else if (shoppingKeywords.some(keyword => expenseName.includes(keyword))) {
        category = 'Shopping';
    }

    // Bills
    else if (
        billsKeywords.some(keyword => expenseName.includes(keyword))
    ) {
        category = 'Bills';
    }

    // append to request
    req.category = category;

    next();
};