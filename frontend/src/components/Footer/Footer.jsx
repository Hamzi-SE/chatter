import React from 'react'

const Footer = () => {
    return (
        <>

            <footer className="page-footer font-small cyan darken-3 bg-primary text-white">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 py-5">
                            <div className="mb-5 flex-center text-center">
                                <a className="fb-ic text-white" href='https://www.facebook.com' target="_blank" rel="noreferrer">
                                    <i className="fab fa-facebook-f fa-lg white-text mr-md-5 mr-3 fa-2x"> </i>
                                </a>

                                <a className="tw-ic text-white" href='https://www.twitter.com' target="_blank" rel="noreferrer">
                                    <i className="fab fa-twitter fa-lg white-text mr-md-5 mr-3 fa-2x"> </i>
                                </a>

                                <a className="gplus-ic text-white" href='https://www.google.com' target="_blank" rel="noreferrer">
                                    <i className="fab fa-google-plus-g fa-lg white-text mr-md-5 mr-3 fa-2x"> </i>
                                </a>

                                <a className="li-ic text-white" href='https://www.linkedin.com' target="_blank" rel="noreferrer">
                                    <i className="fab fa-linkedin-in fa-lg white-text mr-md-5 mr-3 fa-2x"> </i>
                                </a>

                                <a className="ins-ic text-white" href='https://www.instagram.com' target="_blank" rel="noreferrer">
                                    <i className="fab fa-instagram fa-lg white-text mr-md-5 mr-3 fa-2x"> </i>
                                </a>

                                <a className="pin-ic text-white" href='https://www.pinterest.com' target="_blank" rel="noreferrer">
                                    <i className="fab fa-pinterest fa-lg white-text fa-2x"> </i>
                                </a>

                            </div>
                            <div className='d-flex justify-content-center'><a className='text-white font-weight-bold h4' href="/">Chatter <i className="fa-regular fa-comments"></i></a></div>

                        </div>

                    </div>
                </div>

                <div className="footer-copyright text-center py-3">© 2022 Copyright:
                    <a href="/" className='text-white'> Chatter.com</a>
                </div>


            </footer>
        </>
    )
}

export default Footer