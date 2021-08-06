exports.demo = (req, res) => {
  return res.status(200).json({ message: 'You accessed home route' });
};
