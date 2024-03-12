//script.js
document.getElementById('loadHotels').addEventListener('click', loadHotels);

// Initialize an object to store reviews lists for each hotel
const reviewsLists = {};


async function loadHotels() {
    const apiUrl = 'https://cdn.contentful.com/spaces/gyfunrv4a4ak/entries?access_token=k9P9FQJcUpHKrHX3tXrgXunRyiS3qPchtY7V61tNruE&content_type=hotel&limit=5';

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        displayHotels(data.items, data.includes);
    } catch (error) {
        console.error('Error loading hotels:', error.message);
    }
}

function displayHotels(hotels, includes) {
    const hotelListContainer = document.getElementById('hotelList');
    hotelListContainer.innerHTML = '';

    hotels.forEach(hotel => {
        const hotelItem = document.createElement('div');
        hotelItem.classList.add('hotelItem');

        //create a div for imagecontainer and details container
        const imageDetailsContainer = document.createElement('div');
        imageDetailsContainer.classList.add('imageDetailsContainer');

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('imageContainer');

        const hotelImage = getImageForHotel(hotel, includes);
        if (hotelImage) {
            imageContainer.appendChild(hotelImage);
        }
        
        imageDetailsContainer.appendChild(imageContainer)

        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('detailsContainer');

        //Create a div for hotel info and rating
        const hotelInfoContainer = document.createElement('div');
        hotelInfoContainer.classList.add('hotelInfoContainer');

        const hotelName = document.createElement('h3');
        hotelName.textContent = hotel.fields.name;

        const hotelRating = document.createElement('span');
        hotelRating.classList.add('hotelRating');

        for (let i = 5; i >= 1; i--) {
            const star = generateStarRating(i, hotel.fields.rating);
            hotelRating.appendChild(star);
            }

        // Append hotel information to the container
        hotelInfoContainer.appendChild(hotelName);
        hotelInfoContainer.appendChild(hotelRating);

        const hotelCity = document.createElement('span');
        hotelCity.textContent = hotel.fields.city + " "+ '-'+ " " + hotel.fields.country;


        const descriptionValue = hotel.fields.description.content
            .map(paragraph => paragraph.content.map(text => text.value).join(''))
            .join('\n');
        const hotelDescription = document.createElement('p');
        hotelDescription.textContent = descriptionValue;

        // Create a container for review button, price, and dates
        const reviewContainer = document.createElement('div');
        reviewContainer.classList.add('reviewContainer');


        //Create a div for review button
        const reviewButtonContainer = document.createElement('div');

        //Show review button
         const showReviewsBtn = document.createElement('button');
        showReviewsBtn.textContent = 'Show reviews';
        showReviewsBtn.classList.add('showReviewsBtn');
        showReviewsBtn.addEventListener('click', () => {
        loadReviews(hotel.fields, hotel.sys.id, reviewsListContainer);
        showReviewsBtn.style.display = 'none'; // Hide showReviewsBtn
        hideReviewsBtn.style.display = 'inline-block'; // Display hideReviewsBtn
        });
        

        //Create a div for price and date
        const priceDateContainer = document.createElement('div');

        //Create a div for hiding reviews
        const hideReviewsBtn = document.createElement('button');
        hideReviewsBtn.textContent = 'Hide reviews';
        hideReviewsBtn.classList.add('hideReviewsBtn');
        hideReviewsBtn.style.display = 'none'; // Initially hide hideReviewsBtn
        hideReviewsBtn.addEventListener('click', () => {
        reviewsListContainer.innerHTML = ''; // Clear reviews when hiding
        hideReviewsBtn.style.display = 'none'; // Hide hideReviewsBtn
        showReviewsBtn.style.display = 'inline-block'; // Display showReviewsBtn
        });

        const hotelPrice = document.createElement('h4');
        hotelPrice.classList.add('hotelPrice');
        hotelPrice.textContent = hotel.fields.price.value + hotel.fields.price.symbol;
        
        //Start and End Date
        const startDateString = hotel.fields.startDate; 
        const endDateString = hotel.fields.endDate;    
        
        // Parse the input date strings
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);
        
        // Format the dates as "DD.MM.YYYY"
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        
        // Combine the formatted dates
        const formattedDateRange = `${formattedStartDate} - ${formattedEndDate}`;
        
        const availableDates = document.createElement('p');
        availableDates.classList.add('availableDates');
        availableDates.textContent = formattedDateRange;
        
        // Function to format a date as "DD.MM.YYYY"
        function formatDate(date) {
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
          const year = date.getFullYear();
          return `${day}.${month}.${year}`;
        }
   
        // Append review button, price, and dates to the review container
        reviewButtonContainer.appendChild(showReviewsBtn);
        reviewButtonContainer.appendChild(hideReviewsBtn);
        priceDateContainer.appendChild(hotelPrice);
        priceDateContainer.appendChild(availableDates);

        reviewContainer.appendChild(reviewButtonContainer);
        reviewContainer.appendChild(priceDateContainer);

          
        detailsContainer.appendChild(hotelInfoContainer);

        detailsContainer.appendChild(hotelCity);

        detailsContainer.appendChild(hotelDescription);
       
        detailsContainer.appendChild(reviewContainer);

       imageDetailsContainer.appendChild(detailsContainer);

        hotelItem.appendChild(imageDetailsContainer);

        //Create a div for review container
        const reviewItemContainer = document.createElement('div');
        reviewItemContainer.classList.add('reviewItemContainer');

        // Create a container for the reviews list with the dataset attribute
        const reviewsListContainer = document.createElement('ul');
        reviewsListContainer.classList.add('reviewsList');
        reviewsListContainer.dataset.hotelId = hotel.sys.id; 
        reviewItemContainer.appendChild(reviewsListContainer);

        hotelItem.appendChild(reviewItemContainer);
        hotelListContainer.appendChild(hotelItem);
    });
}
   
    //Get Hotel images    
    function getImageForHotel(hotel, includes) {
        
        const hotelId = hotel.fields.images.map(image => image.sys.id);

        //Find the matching image for the hotel
        const matchingImage = includes.Asset.find(asset => hotelId.includes(asset.sys.id));
        
        if (matchingImage) {
            const imageUrl = matchingImage.fields.file.url;
  
            const imageElement = document.createElement('img');
            imageElement.src = `https:${imageUrl}`;
            imageElement.alt = hotel.fields.name; // Set alt text as the hotel name

            return imageElement;
        } else {
            console.log('No matching image found for hotel:', hotel.fields.name);
            return null;
        }
    }
    
    //Hotel rating    
    function generateStarRating(starIndex, rating) {
        const star = document.createElement('span');
        star.classList.add('star', starIndex <= rating ? 'filled' : 'empty');
        star.innerHTML = '&#9733;'; // Unicode character for a star
        return star;
    }
    

    //Hotel Review 
    async function loadReviews(hotel, hotelId, reviewsListContainer) {
        const reviewsUrl = `https://cdn.contentful.com/spaces/gyfunrv4a4ak/entries?access_token=k9P9FQJcUpHKrHX3tXrgXunRyiS3qPchtY7V61tNruE&content_type=review&fields.hotel.sys.id=${hotelId}`;

        try {
            const response = await fetch(reviewsUrl);
            const data = await response.json();
    
            // Check if the 'items' property exists in the response
            if (data.items && data.items.length > 0) {
                // Clear the existing content in the reviewsListContainer
                reviewsListContainer.innerHTML = '';
    
                // Iterate through the comments and create list items
                data.items.forEach(review => {
                    // Check if the 'comment' field exists in the review
                    if (review.fields && review.fields.comment) {
                        const reviewItem = document.createElement('li');

                        // Get the feedback type (positive or negative)
                        const feedbackType = review.fields.feedback;
                        const sign = feedbackType === 'positive' ? '' : '';

                        // Add a line break after each review
                        const lineBreak = document.createElement('hr');
                        reviewsListContainer.appendChild(lineBreak);
                        
                        //Get reviews
                        const comments = review.fields.comment.content
                        .map((paragraph) => paragraph.content.map((text) => text.value).join("\n"))
                        .join("\n");

                        
                        // Prepend the sign to the comment
                        reviewItem.textContent = `${sign} ${comments}`;
                        reviewsListContainer.appendChild(reviewItem);

                        // Add a class based on the feedback type for styling
                        reviewItem.classList.add(feedbackType);
                        reviewsListContainer.appendChild(reviewItem);

                    } else {
                        console.warn('Comment field not found in the review:', review);
                    }
                });
    
                console.log(data.items);
            } else {
                console.warn('No review items found in the response:', data);
            }
        } catch (error) {
            console.error('Error loading reviews:', error.message);
        }
    }
