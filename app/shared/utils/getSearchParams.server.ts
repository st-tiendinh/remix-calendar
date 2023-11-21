type Params = {
  url: string;
  success?: string;
  error?: string;
};

export const getSearchParams = ({ url, success, error }: Params) => {
  const newUrl = new URL(url);
  const messages = {
    success: newUrl.searchParams.get('success') || success,
    error:newUrl.searchParams.get('error') || error,
  };

  return messages;
};
