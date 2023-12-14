export const login = (req, params) => {
  return req
    .fetch({
      url: `${process.env.PROXY_URL}/auth/login`,
      method: "post",
      data: params,
    })
    .then(({ data }) => {
      // save auth info to session
      const { token, data: user } = data.body;

      if (user?.role !== "Admin" && user?.role !== "PO") {
        throw new Error(
          "Front Office hanya boleh diakses oleh Pegawai PO atau Admin"
        );
      }

      const rawData = jwt.decode(token);

      if (!rawData) {
        throw new Error("Akses anda tidak valid, silakan coba login kembali");
      }

      const oauth = {
        token,
        expired: Date.now() + (rawData.exp - 5) * 1000,
      };
      const currentUser = {
        username: user.username,
        id: user.id,
        role: user.role,
        name: user.name,
      };

      req.fetch.defaults.headers.common.authorization = `Bearer ${token}`;
      req.session.userAuth = oauth;
      req.session.currentUser = currentUser;

      return currentUser;
    });
};

export const logout = (req) => {
  delete req.session.userAuth;
  delete req.session.currentUser;
  delete req.fetch.defaults.headers.common.authorization;
};

const jwt = {
  decode(token) {
    try {
      return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    } catch (e) {
      return null;
    }
  },
};
