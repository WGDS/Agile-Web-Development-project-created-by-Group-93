//Group 93 CITS3403 Project 2025
//fetch request to upload movie.
//upload_move uploads rating and movie to the user

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("movieForm");
    const input = document.getElementById("movie_title");
    const resultBox = document.getElementById("autocomplete-results");

    // Form submit logic
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const movieTitle = form.elements["movie_title"].value;
        const userRating = form.elements["user_rating"].value;

        try {
            const response = await fetch("/upload_movie", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    movie_title: movieTitle,
                    user_rating: userRating
                })
            });

            const result = await response.json();
            const resultDiv = document.getElementById("movieResult");
            if (response.ok) {
                resultDiv.textContent = result.message;
                resultDiv.classList.add("result_text")
                resultDiv.classList.add("styled_text")
            } else {
                resultDiv.textContent = result.error || "Error occurred";
                resultDiv.classList.add("result_text")
                resultDiv.classList.add("styled_text")
            }
        } catch (error) {
            console.error("Error submitting movie:", error);
            document.getElementById("movieResult").textContent = "Request failed.";
        }
    });

    // Debounced autocomplete logic
    let debounceTimeout;
    input.addEventListener("input", () => {
        clearTimeout(debounceTimeout);
        const query = input.value.trim();

        if (query.length === 0) {
            resultBox.innerHTML = "";
            return;
        }

        //This code uses the API key to auto complete the movie title.
        //Depending on USE_OMDB_API = True/False it will use the correct route
        debounceTimeout = setTimeout(() => {
            const endpoint = USE_OMDB_API
                ? `/autocomplete_movie?q=${encodeURIComponent(query)}`
                : `/search_movies?q=${encodeURIComponent(query)}`;
        
            fetch(endpoint)
                .then(res => res.json())
                .then(data => {
                    resultBox.innerHTML = "";
                    (data.results || []).forEach(title => {
                        const li = document.createElement("li");
                        li.textContent = title;
                        li.addEventListener("click", () => {
                            input.value = title;
                            resultBox.innerHTML = "";
                        });
                        resultBox.appendChild(li);
                    });
                });
        }, 300);  // Debounce delay
        

        //////
        
    });

    // Click outside to clear results
    document.addEventListener("click", (e) => {
        if (!resultBox.contains(e.target) && e.target !== input) {
            resultBox.innerHTML = "";
        }
    });
});
