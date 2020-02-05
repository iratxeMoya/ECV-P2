var avatar = document.querySelector('img#clip');
avatar.addEventListener('click', selectAvatar);

function selectAvatar () {
    console.log('selected: ', this.src);
}