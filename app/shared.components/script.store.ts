// ScriptStore.ts contains the path of the script either locally or on a remote server, and a name that is used to load the script dynamically

interface Scripts {
    name: string;
    src: string;
}
export const ScriptStore: Scripts[] = [
    { name: 'inspinia', src: '../../Scripts/bootstrap/bootstrap-theme/inspinia.min.js' },
    { name: 'misc', src: '../../app/shared/misc.js' }
];
