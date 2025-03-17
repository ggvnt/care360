export const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).send("Error creating user");
  }
};

export const login = async (req, res) => {};
export const logout = async (req, res) => {};
