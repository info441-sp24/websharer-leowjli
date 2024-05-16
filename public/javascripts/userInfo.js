async function init(){
    await loadIdentity();
    loadUserInfo();
}

// async function refreshComments(postID){
//     let commentsElement = document.getElementById(`comments-${postID}`);
//     commentsElement.innerHTML = "loading..."

//     let commentsJSON = await fetchJSON(`api/${apiVersion}/comments?postID=${postID}`)
//     commentsElement.innerHTML = getCommentHTML(commentsJSON);
// }

// async function postComment(postID){
//     let newComment = document.getElementById(`new-comment-${postID}`).value;

//     let responseJson = await fetchJSON(`api/${apiVersion}/comments`, {
//         method: "POST",
//         body: {postID: postID, newComment: newComment}
//     })
    
//     refreshComments(postID);
// }


async function saveUserInfo(){
    //TODO: do an ajax call to save whatever info you want about the user from the user table
    //see postComment() in the index.js file as an example of how to do this
}

async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if(username==myIdentity){
        document.getElementById("username-span").innerText= `You (${username})`;
        document.getElementById("user_info_new_div").classList.remove("d-none");
        
    }else{
        document.getElementById("username-span").innerText=username;
        document.getElementById("user_info_new_div").classList.add("d-none");
    }
    
    //TODO: do an ajax call to load whatever info you want about the user from the user table
    try {
        const response = await fetch(`/api/${apiVersion}/users?username=${username}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }
        const userInfo = await response.json();
        document.getElementById("user-info-username").innerText = userInfo.username;
        document.getElementById("user-info-favorite-song").innerText = userInfo.favorite_song;
    } catch (err) {
        console.error('Error loading user info:', err);
    }

    loadUserInfoPosts(username)
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