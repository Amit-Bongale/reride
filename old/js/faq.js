document.addEventListener("DOMContentLoaded", function () {
    const faqContainer = document.getElementById("faq-container");

    fetch("./json/faq.json")
        .then(response => response.json())
        .then(data => {
            const faqs = data.faq;

            faqs.forEach((item, index) => {
                const questionId = `collapseFaq${index}`;
                const faqItem = document.createElement("div");
                faqItem.innerHTML = `
                        <p>
                            <button class="btn btn-primary" style="background-color: #0A1F58;width:100%;display: flex;justify-content: flex-start;margin-top:1%" type="button" data-bs-toggle="collapse" data-bs-target="#${questionId}" aria-expanded="false" aria-controls="${questionId}">
                                ${item.question}
                            </button>
                        </p>
                        <div class="collapse" id="${questionId}">
                            <div class="card card-body" style="background-color: #FAF2F0">
                                ${item.answer}
                            </div>
                        </div>
                    `;
                faqContainer.appendChild(faqItem);
            });
        })
        .catch(error => {
            console.error("Error loading FAQ data:", error);
            faqContainer.innerHTML = `<p style="color: red;">Failed to load FAQ data.</p>`;
        });
});