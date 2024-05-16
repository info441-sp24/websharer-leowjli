async function init(){
    await loadIdentity();
    loadUserInfo();
}

async function saveUserInfo(){
    let favorite_song = document.getElementById("favorite_song_input").value;
    await fetchJSON(`/api/${apiVersion}/users`, {
        method: "POST",
        body: {favorite_song: favorite_song}
    });

    loadUserInfo();
}

async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if(username==myIdentity) {
        document.getElementById("username-span").innerText= `You (${username})`;
        document.getElementById("user_info_new_div").classList.remove("d-none");
        
    } else {
        document.getElementById("username-span").innerText=username;
        document.getElementById("user_info_new_div").classList.add("d-none");
    }

    try {
        const response = await fetch(`/api/${apiVersion}/users?user=${username}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }
        const userInfo = await response.json();

        let userHTML = userInfo.map(userInfo => {
            return `
            <hr>
            <div id="user-info">
                <h5><strong>Favorite Songs:</strong></h5> ${userInfo.favorite_song}
            </div>        
            `
        }).join("");

        document.getElementById("user_info_div").innerHTML = userHTML;
    } catch (err) {
        console.error('Error loading user info:', err);
    }

    loadUserInfoPosts(username);
}


async function loadUserInfoPosts(username){
    document.getElementById("posts_box").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/posts?username=${encodeURIComponent(username)}`);
    let postsHtml = postsJson.map(postInfo => {
        return `
        <div class="post">
            ${escapeHTML(postInfo.description)}
            ${postInfo.htmlPreview}
            <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.username)}</a>, ${escapeHTML(postInfo.created_date)}</div>
            <div class="post-interactions">
                <div>
                    <span title="${postInfo.likes? escapeHTML(postInfo.likes.join(", ")) : ""}"> ${postInfo.likes ? `${postInfo.likes.length}` : 0} likes </span> &nbsp; &nbsp; 
                </div>
                <br>
                <div><button onclick='deletePost("${postInfo.id}")' class="${postInfo.username==myIdentity ? "": "d-none"}">Delete</button></div>
            </div>
        </div>`
    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;
}


async function deletePost(postID){
    let responseJson = await fetchJSON(`api/${apiVersion}/posts`, {
        method: "DELETE",
        body: {postID: postID}
    })
    loadUserInfo();
}