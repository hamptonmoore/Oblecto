export default (command, args) => {
    console.log(`Invalid number of arguments: please use "owoblecto ${command} ${args.map((a)=>`[${a}]`).join(' ')}"`);
};