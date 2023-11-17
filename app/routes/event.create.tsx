import FormEvent, { FormEventMethod } from '~/shared/components/FormEvent';

export default function EventCreate() {
  return <FormEvent method={FormEventMethod.CREATE} />;
}
