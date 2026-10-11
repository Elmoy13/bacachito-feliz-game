import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PrefieresContent from '@/components/game/PrefieresContent';

afterEach(() => {
  vi.useRealTimers();
});

const renderCard = (onCardClick = vi.fn(), resetKey: string = 'card-1') =>
  render(
    <div onClick={onCardClick}>
      <PrefieresContent
        title="¿Qué prefieres?"
        optionA="2 años en la cárcel"
        optionB="2 años en coma"
        sips={3}
        resetKey={resetKey}
      />
    </div>
  );

describe('PrefieresContent', () => {
  it('muestra ambas opciones y la regla de la minoría', () => {
    renderCard();
    expect(screen.getByText('2 años en la cárcel')).toBeInTheDocument();
    expect(screen.getByText('2 años en coma')).toBeInTheDocument();
    expect(screen.getByText('La minoría toma 3 tragos 🍻')).toBeInTheDocument();
    expect(screen.getByText('Empate: todos toman 1')).toBeInTheDocument();
  });

  it('el botón de cuenta regresiva no avanza la carta y llega a ¡VOTEN!', () => {
    vi.useFakeTimers();
    const onCardClick = vi.fn();
    renderCard(onCardClick);

    fireEvent.click(screen.getByRole('button', { name: /A la de 3/ }));
    expect(onCardClick).not.toHaveBeenCalled();
    expect(screen.getByText('1')).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(800); });
    act(() => { vi.advanceTimersByTime(800); });
    act(() => { vi.advanceTimersByTime(800); });
    expect(screen.getByText('¡VOTEN!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Otra vez/ })).toBeInTheDocument();
  });

  it('reinicia la cuenta al cambiar de carta', () => {
    vi.useFakeTimers();
    const { rerender } = renderCard();
    fireEvent.click(screen.getByRole('button', { name: /A la de 3/ }));
    rerender(
      <div>
        <PrefieresContent title="¿Qué prefieres?" optionA="A" optionB="B" resetKey="card-2" />
      </div>
    );
    expect(screen.getByRole('button', { name: /A la de 3/ })).toBeInTheDocument();
    expect(screen.getByText('La minoría toma 2 tragos 🍻')).toBeInTheDocument();
  });
});
