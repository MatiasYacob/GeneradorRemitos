document.getElementById("logout").addEventListener("click", function() {
    document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.location.href = "/";
    
});