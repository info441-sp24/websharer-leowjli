
async function previewUrl(){
    let url = document.getElementById("urlInput").value;
    
    try {
      const response = await fetch("/api/v1/urls/preview?url=" + url);
      if (!response.ok) {
        throw new Error("Failed to fetch the preview");
      }
      let preview = await response.text();
      displayPreviews(preview)
    } catch (err) {
      displayPreviews("Error: " + err.message)
    }
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
