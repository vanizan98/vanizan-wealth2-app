import CustomAffirmation from './CustomAffirmation';

export default function LazyCustomTab(props: any) {
  return <div className="fade-in-up"><CustomAffirmation {...props} /></div>;
}
