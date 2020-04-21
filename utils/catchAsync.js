module.exports = (func) => {
  //This function is for catching async error. The function will get the function as argument and will return the same function with excecution in it and if the promise is rejected calls the catch
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
