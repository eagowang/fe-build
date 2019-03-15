/**
 * 根据项目名和版本号拼装releaseId => project@version
 *
 * @param {*} [appPkg={}] package.json文件
 * @returns
 */
function getReleaseId(appPkg = {}) {
  const { name = 'unknown', version = '1.0.0' } = appPkg;
  const projectSlug = name.replace('@', '').replace('/', '-');
  return projectSlug + '@' + version;
}

module.exports = { getReleaseId };
