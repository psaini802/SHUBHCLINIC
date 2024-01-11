import { useRef, useState } from "react"
import ApiService, { Apiurls } from "../WebService/ApiService"
import { useDispatch, } from "react-redux"
import { AuthReducer } from "../reduxData/AuthSlice"
import { useNavigate } from 'react-router-dom'
export default function Login() {

    const [msg, setMsg] = useState("")
    const [loading, setLoading] = useState(false)
    const emailBox = useRef()
    const passBox = useRef() 
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const ulogin = async (event) => {
        event.preventDefault()
        var ob = {
            email: emailBox.current.value,
            password: passBox.current.value
        }

        try {
            setLoading(true)
            const response = await ApiService.PostAPiCall(Apiurls.LOGIN, ob)
            console.log(response)
            if (response.status) {
                setMsg(response.data.msg)
                const d = dispatch(AuthReducer({ token: response.data.data.token, name: response.data.data.user.name, type: response.data.data.userType, isLogin: true, id: response.data.data.user.id }))
                console.log(d)
                navigate("/")
            }
            else {
                setMsg(response.data.msg)
            }

        } catch (error) {
            setMsg("Network Error !")
        }
        finally {
            setLoading(false)
        }

    }
    return <>
        <section id="appointment" className="appointment section-bg " style={{ marginTop: "80px" }}>
            <div className="container">
                <div className="section-title">
                    <h2>Login Here..!</h2>
                    <p>{msg}</p>
                </div>
                <form onSubmit={ulogin} className="php-email-form">
                    <div className="row">
                        <div className="col-md-6 form-group mt-3 mt-md-0">
                            <label>Email</label>
                            <input ref={emailBox} type="email" className="form-control" name="email" id="email" placeholder="Your Email" required/>
                        </div>
                        <div className="col-md-6 form-group mt-3 mt-md-0">
                            <label>Password</label>
                            <input ref={passBox} type="password" className="form-control" name="password" id="pass" placeholder="Enter Your Password" required />
                        </div>
                    </div>
                    <div className="text-center"><button className="btn btn-primary btn-lg">{loading ? <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div> : " Login"}</button></div>
                </form>

            </div >
        </section >

    </>
}