import { json } from '@remix-run/node';
import { type ModalProps } from '../components/Modal';

export const resolveModal = (
  paramsValue: any,
  event: string |object|null,
  objReturn: any
) => {

  const modalAction = paramsValue.modalAction as ModalProps;
  const modalType = paramsValue.modalType as ModalProps;
  if (paramsValue && modalAction && modalType) {
    return json({
      ...objReturn,
      modalProps: {
        action: modalAction,
        type: modalType,
        event,
      },
    });
  } else {
    return json( objReturn );
  }
};
