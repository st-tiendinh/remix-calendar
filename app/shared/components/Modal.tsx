import ConfirmDeleteEvent from './modals_form/ConfirmDeleteEvent';

export enum ModalType {
  CONFIRM = 'confirm',
  DATA = 'data',
}

export enum ModalAction {
  DELETE_EVENT = 'delete-event',
  EDIT_EVENT = 'edit-event',
}

export type ModalProps =
  | {
      type?: ModalType.CONFIRM;
      action: ModalAction.DELETE_EVENT;
      deleteEventId: string;
    }
  | {
      type?: ModalType.CONFIRM;
      action: ModalAction.EDIT_EVENT;
      editEventId: string;
    }
  | null;

const Modal: React.FC<{ modalProps: ModalProps }> = ({ modalProps }) => {
  return (
    <div className="modal" hidden={!modalProps}>
  
      {modalProps?.type === ModalType.CONFIRM &&
        modalProps?.action === ModalAction.DELETE_EVENT && (
          <ConfirmDeleteEvent eventId={modalProps.deleteEventId} />
        )}
    </div>
  );
};

export default Modal;
