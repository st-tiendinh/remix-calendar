import ConfirmDeleteEvent from './modals_form/ConfirmDeleteEvent';
import ShowEventDetail from './modals_form/ShowEventDetail';

export enum ModalType {
  CONFIRM = 'confirm',
  DATA = 'data',
}

export enum ModalAction {
  DELETE_EVENT = 'delete-event',
  EDIT_EVENT = 'edit-event',
  SHOW_EVENT = 'show-event',
}

export type ModalProps =
  | {
      type?: ModalType.CONFIRM;
      action: ModalAction.DELETE_EVENT;
      event: string;
    }
  | {
      type?: ModalType.CONFIRM;
      action: ModalAction.EDIT_EVENT;
      event: string;
    }
  | {
      type?: ModalType.DATA;
      action: ModalAction.SHOW_EVENT;
      event: any;
    }
  | null;

const Modal: React.FC<{ modalProps: ModalProps }> = ({ modalProps }) => {
  console.log(modalProps);
  return (
    <div className="modal" hidden={!modalProps}>
      {modalProps?.type === ModalType.CONFIRM &&
        modalProps?.action === ModalAction.DELETE_EVENT && (
          <ConfirmDeleteEvent eventId={modalProps.event} />
        )}
      {modalProps?.type === ModalType.DATA &&
        modalProps?.action === ModalAction.SHOW_EVENT && (
          <ShowEventDetail event={modalProps.event} />
        )}
    </div>
  );
};

export default Modal;
