//File:register.js
// used by register.html
// send username, email, password and role to backend
// -- backend creates salt and hashed passowrd
// -- then tries to insert into database

async function register(event) {
    console.log("here we are in register.js");
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(document.getElementById("register-form"));

    const userData = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role")
    };

    const jsonBody = JSON.stringify(userData);

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonBody // JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            // Show success alert and redirect to frontpage.html
            console.log("Registration OK:");
            console.log(result);
            if(result.success == true){
               alert(`${result.message} for ${result.username}`);
               window.location.href = "frontpage.html";
            } else {
               alert(`${result.message}`);
            }
        } else {
            // Show error alert if registration fails
            console.log("response not OK");
            console.log(result);
            console.log("Failed to register:", response.statusText);
            alert(result.error || "Registration failed. Please try again." || `for User: ${result.name}`);
        }

    } catch (error) {
        console.error("... error in registration");
        console.error("Error during registration:", error);
        console.error(`jsonBody: ${jsonBody}`);
        alert("An error occurred. Please try again.");
    }
}
