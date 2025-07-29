import jwt from 'jsonwebtoken';

//kullanıcı token'ını doğrulamak için
export const verifyToken = (req, res, next) => {
    //token'ı cookie'lerden yada header'lardan al
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    //token verilmemişse hata
    if(!token)
        return res.status(401).json({success: false, msg:'Token\'s missing '});

    try {
        //token'ı ayrıştır, eğer token geçersizse hata çıkar
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //kullanıcı bilgileri burada
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, msg: "Invalid or expired token" });
    }
}