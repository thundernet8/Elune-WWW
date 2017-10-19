import CodeComponent from "./code";

const strategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === "code"
        );
    }, callback);
};

const decorator = {
    strategy,
    component: CodeComponent
};

export default decorator;
