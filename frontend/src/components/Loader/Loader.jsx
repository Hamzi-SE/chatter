import React from 'react'
import { Vortex } from 'react-loader-spinner'
import "./loader.css"

const Loader = () => {
    return (
        <>
            <div className="container-fluid loading-vortex">
                <Vortex
                    visible={true}
                    height={100}
                    width={100}
                    ariaLabel="vortex-loading"
                    wrapperStyle={{}}
                    wrapperClass="vortex-wrapper"
                    colors={['blue', 'white', 'blue', 'white', 'white', 'blue']}
                />
            </div>
        </>
    )
}

export default Loader