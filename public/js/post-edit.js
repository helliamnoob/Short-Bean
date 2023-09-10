const params = new URLSearchParams(window.location.search);
const post_id = params.get('post_id');

document.getElementById("updatePost","onnicknamePut").addEventListener("click", async function () {
    // 게시글 수정 버튼 클릭 시

document
  .getElementById("updatePost")
  .addEventListener("click", async function () {
    const postTitle = document.getElementById("post-title").value;
    const postContent = document.getElementById("post-content").value;
    const subject = document.getElementById("subject").value;
    
    const newdata = JSON.stringify({
        postTitle,
        postContent,
        subject,

      });

      console.log(newdata);

      fetch(`/api/post/${post_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: newdata,
    })
    .then(response => {
        if (response.ok) {
            // 게시글 수정 성공
            // 팝업 창으로 로그인 완료 메시지 전송
            window.opener.postMessage("loggedIn", "*");
            window.close();
        } else {
            // 게시글 수정 실패
            alert("게시글 수정에 실패했습니다.");
        }
    })


    .catch(error => {
        console.error("게시글 수정 중 오류가 발생했습니다.", error);
        alert("게시글 수정 중 오류가 발생했습니다.");
    });
});

})