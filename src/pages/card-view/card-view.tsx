import { cx } from "@/utils/cx";
import { Link, useParams } from "wouter";

import { Masthead } from "@/components/masthead";
import { Button } from "@/components/ui/button";
import { CardViewCards } from "@/pages/card-view/card-view-cards";
import { useStore } from "@/store";
import { selectCardWithRelations } from "@/store/selectors/card-view";
import { useDocumentTitle } from "@/utils/use-document-title";

import { CardModalProvider } from "@/components/card-modal/card-modal-context";
import { Footer } from "@/components/footer";
import { Error404 } from "../errors/404";
import css from "./card-view.module.css";
import { Faq } from "./faq";
import { UsableBy } from "./usable-by";

function CardView() {
  const { code } = useParams();

  const cardWithRelations = useStore((state) =>
    selectCardWithRelations(state, code, true, undefined),
  );

  useDocumentTitle(
    cardWithRelations ? `${cardWithRelations.card.real_name}` : undefined,
  );

  if (!cardWithRelations) {
    return <Error404 />;
  }

  const isInvestigator = cardWithRelations.card.type_code === "investigator";
  const parallel = cardWithRelations.relations?.parallel?.card;

  return (
    <CardModalProvider>
      <div className={cx(css["layout"], "fade-in")}>
        <Masthead className={css["header"]} />
        <main className={css["main"]}>
          <CardViewCards
            cardWithRelations={cardWithRelations}
            key={cardWithRelations.card.code}
          />
        </main>
        <nav className={css["sidebar"]}>
          <div className={css["sidebar-inner"]}>
            <SidebarSection title="Actions">
              <Button
                as="a"
                href={`https://arkhamdb.com/card/${cardWithRelations.card.code}`}
                rel="noreferrer"
                target="_blank"
                size="full"
              >
                <i className="icon-world" /> Open on ArkhamDB
              </Button>
              {isInvestigator && (
                <Link
                  asChild
                  href={`/deck/create/${cardWithRelations.card.code}`}
                >
                  <Button
                    as="a"
                    data-testid="card-modal-create-deck"
                    size="full"
                  >
                    <i className="icon-deck" /> Create deck
                  </Button>
                </Link>
              )}
            </SidebarSection>
            <SidebarSection title="FAQ">
              <Faq card={cardWithRelations.card} />
            </SidebarSection>

            <SidebarSection title="Deckbuilding">
              {isInvestigator && (
                <>
                  <Link
                    asChild
                    href={`/card/${cardWithRelations.card.code}/usable_cards`}
                  >
                    <Button size="full" data-testid="usable-cards">
                      <i className="icon-cards" /> Cards usable by{" "}
                      {cardWithRelations.card.real_name}
                    </Button>
                  </Link>
                  {parallel && (
                    <Link asChild href={`/card/${parallel.code}/usable_cards`}>
                      <Button size="full" data-testid="usable-cards-parallel">
                        <i className="icon-cards" /> Cards usable by{" "}
                        <i className="icon-parallel" /> {parallel.real_name}
                      </Button>
                    </Link>
                  )}
                </>
              )}
              {!isInvestigator && <UsableBy card={cardWithRelations.card} />}
            </SidebarSection>
          </div>
        </nav>
        <Footer />
      </div>
    </CardModalProvider>
  );
}

function SidebarSection(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={css["sidebar-section"]}>
      <header className={css["sidebar-section-header"]}>
        <h2 className={css["sidebar-section-title"]}>{props.title}</h2>
      </header>
      <div className={css["sidebar-section-content"]}>{props.children}</div>
    </section>
  );
}

export default CardView;
