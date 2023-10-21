import React from 'react';

function Menu({title, description}){
    const [in_animation, update_animation] = React.useState('deanimate')
    const handleMouse = (Base)=>{
        Base.preventDefault()
        update_animation('animate')
    }
    return (
        <a onMouseLeave={()=>update_animation('deanimate')} onMouseEnter={handleMouse} style={{textDecoration:'none'}} href={'drawing/'+title}>
            <div style={{cursor:'pointer', maxWidth: "60%", margin:'auto', marginTop:'15px'}} class={`${in_animation} card text-white bg-dark mb-3`} >

                <div class="card-body">
                    <h5 class="card-title">{title}</h5>
                    <p class="card-text">{description}</p>
                </div>
            </div>
        </a>
    )
}

export default Menu;