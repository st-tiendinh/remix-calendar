import { json } from '@remix-run/node';
import { type ModalProps } from '../components/Modal';

export const resolveModal = (
  paramsValue: any,
  eventId: any,
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
        deleteEventId: eventId,
      },
    });
  } else {
    return json({ objReturn });
  }
};
