type Params = {
  url: string;
};

export const getSearchParams = ({ url}: Params) => {
  const newUrl = new URL(url).searchParams;
  const messages = {
    success: newUrl.get('success'),
    error:newUrl.get('error'),
    modalType: newUrl.get('modal-type'),
    modalAction: newUrl.get('modal-action'),
  };

  return messages;
};
