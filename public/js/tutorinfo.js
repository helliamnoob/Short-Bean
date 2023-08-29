document.addEventListener('DOMContentLoaded', async () => {
    const tutorList = document.getElementById("Tutors");

    const response = await fetch("/api/tutors");
    const tutors = await response.json();

    for (const tutor of tutors) {
        const {
            school_name: tutorName,
            tutor_id: tutorId,
            career: tutorCareer,
            user_id: user_id,
            
        } = tutor;

        const listTutor = document.createElement('li');
        listTutor.innerHTML = `
            <li>
                <div class="box person">
                    <div class="image round">
                        <img src="/public/images/pic03.jpg" />
                    </div>
                    <h3>${tutorName}</h3>
                    <p>${tutorCareer}</p>
                    <button type="button" class="userMarkBtn" value="${tutorId}">즐겨찾기</button>
                    <button type="button" class="facechatBtn" data-user-id="${user_id}">화상채팅</button>
                </div>
            </li>
        `;

        tutorList.appendChild(listTutor);
    }
});