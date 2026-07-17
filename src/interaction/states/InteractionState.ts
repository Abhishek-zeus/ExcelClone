//Contract, Every state MUST implement these methods

export interface InteractionState{
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    onDoubleClick(event: PointerEvent): void;
}