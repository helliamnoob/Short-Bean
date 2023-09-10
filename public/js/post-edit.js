// 페이지 URL로부터 post_id를 추출
const params = new URLSearchParams(window.location.search);
const post_id = params.get('post_id');

// updatePost 버튼에 클릭 이벤트 리스너를 등록
document.getElementById("updatePost").addEventListener("click", async function () {
    const postTitle = document.getElementById("post-title").value;
    const postContent = document.getElementById("post-content").value;
    const subject = document.getElementById("subject").value;
    const image = document.getElementById("imagevlaue").value;

    const newdata = JSON.stringify({
         title:postTitle,
        content:postContent,
        subject:subject,
        image:image
    });

    console.log(newdata);

    try {
        const response = await fetch(`/api/post/${post_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: newdata,
        });
        console.log(newdata);

        const responseData = await response.json();
        console.log(responseData);// API 응답을 JSON으로 변환
        if (response.ok) {
            if (responseData.data && responseData.data.post_id) {
                const returned_image = responseData.data.image;
                const returned_title = responseData.data.title;
                const returned_content = responseData.data.content;
                const returned_subject = responseData.data.subject;

                console.log(`Returned Post ID:  Title: ${returned_title}, Content: ${returned_content}, Image :${returned_image},Subject: ${returned_subject}`);
            }

            console.log(responseData);

            console.log("성공적으로 수정되었습니다:", responseData.data);
            window.opener.postMessage("loggedIn", "*");
            window.close();
        } else {
            console.error("게시글 수정 실패:", responseData);
            alert("게시글 수정에 실패했습니다.");
        }
    } catch (error) {
        console.error("게시글 수정 중 오류가 발생했습니다.", error);
        alert("게시글 수정 중 오류가 발생했습니다.");
    }
});


