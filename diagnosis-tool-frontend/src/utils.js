export const displayNameToUrlName = (displayName) => {
  return displayName.toLowerCase().replace(' ', '-');
};

export const urlNameToDisplayName = (urlName) => {
  const capitalizedName = `${urlName.charAt(0).toUpperCase()}${urlName.slice(1)}`;
  return capitalizedName.replace('-', ' ');
};

export const getApiBaseEndpoint = () => {
  return 'http://localhost:8080/api';
}
