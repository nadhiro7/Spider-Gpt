'use client'
function Portal() {
    const closeSideBar = () => {
        const portal = document.getElementById('portal')
        portal?.classList.remove('portal')
        const sidebar = document.getElementById('sidebar')
        sidebar?.classList.remove('sidebar');

    }
    return (
        <div id='portal' className="anime" onClick={closeSideBar} >

        </div>
    )
}

export default Portal