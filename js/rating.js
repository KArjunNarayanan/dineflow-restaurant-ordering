function getFoodRating(foodId, allReviews) {
    const foodReviews = allReviews.filter((review) => {
        return String(review.foodId) === String(foodId);
    });
    if (foodReviews.length === 0) {
        return {
            rating: 0,
            reviewCount: 0
        };
    }
    const totalRating = foodReviews.reduce((total, review) => {
        return total + Number(review.rating);
    }, 0);
    return {
        rating: totalRating / foodReviews.length,
        reviewCount: foodReviews.length
    };
}
