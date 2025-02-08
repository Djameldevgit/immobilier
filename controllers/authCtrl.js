const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const i18next = require('i18next');
const authCtrl = {

    
register: async (req, res) => {s
    
    try {
        const { username, email, password } = req.body
        let newUserName = username.toLowerCase().replace(/ /g, '')

        const user_name = await Users.findOne({ username: newUserName })
        if (user_name) return res.status(400).json({ msg: i18next.t('This user name already exists.') })

        const user_email = await Users.findOne({ email })
        if (user_email) return res.status(400).json({ msg: i18next.t('This email already exists.') })

        if (password.length < 6)
            return res.status(400).json({ msg: i18next.t('Password must be at least 6 characters.') })

        const passwordHash = await bcrypt.hash(password, 12)

        const newUser = new Users({
            username: newUserName, email, password: passwordHash
        })


        const access_token = createAccessToken({ id: newUser._id })
        const refresh_token = createRefreshToken({ id: newUser._id })

        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/refresh_token',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
        })

        await newUser.save()
        const activation_token = createActivationToken({ id: newUser._id })

        const url = `${CLIENT_URL}/activate/${activation_token}`
        sendMail(email, url, "Verify your email address")
        res.json({
            msg: i18next.t('Register Success! Please activate your email to start!'),
            access_token,
            user: {
                ...newUser._doc,
                password: ''
            }
        })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
},
 
 

activateEmail: async (req, res) => {
    try {
        const { activation_token } = req.body;
        const data = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET);

        const { id } = data;

        // Encuentra y actualiza el usuario existente en la base de datos
        const user = await Users.findByIdAndUpdate(id, { activated: true });

        if (!user) {
            return res.status(400).json({ msg: "User not found." });
        }

        res.json({ msg: "Account has been activated!" });

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
},


    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await Users.findOne({ email })
                .populate("followers following ", "avatar username followers following")

            if (!user) return res.status(400).json({
                msg:
                    i18next.t('ce rmail no existe pas.')
            })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: i18next.t('Le mot de passe pas corecte.') })

            const access_token = createAccessToken({ id: user._id })
            const refresh_token = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
            })

            res.json({
                msg: i18next.t('login success'),

                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
        logout: async (req, res) => {
            try {
                res.clearCookie('refreshtoken', { path: '/api/refresh_token' })
                return res.json({ msg: i18next.t('Logged out!') })
            } catch (err) {
                return res.status(500).json({ msg: err.message })
            }
        },
        generateAccessToken: async (req, res) => {
            try {
                const rf_token = req.cookies.refreshtoken
                if(!rf_token) return res.status(400).json({msg: "Please login now."})
    
                jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async(err, result) => {
                    if(err) return res.status(400).json({msg: "Please login now."})
    
                    const user = await Users.findById(result.id).select("-password")
                    .populate('followers following', 'avatar username fullname followers following')
    
                    if(!user) return res.status(400).json({msg: "This does not exist."})
    
                    const access_token = createAccessToken({id: result.id})
    
                    res.json({
                        access_token,
                        user
                    })
                })
                
            } catch (err) {
                return res.status(500).json({msg: err.message})
            }
        }
        
        
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
}

module.exports = authCtrl