const changeTheme = darkMode => {
    const body = document.querySelector('body');
    const sidebar = document.querySelector('#sidebarMenu');

    if (darkMode) {
        body.setAttribute('data-bs-theme', 'dark');
        sidebar.classList.remove('bg-white');
        sidebar.classList.add('bg-dark');
    } else {
        body.setAttribute('data-bs-theme', 'light');
        sidebar.classList.remove('bg-dark');
        sidebar.classList.add('bg-white');
    }
};

export default changeTheme;