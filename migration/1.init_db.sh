# Being the user spedata, I can then,
export PGUSER=spedata

# delete the ecotips DB and user,
dropdb pokedex
echo "BDD supprimée"
dropuser pokedex
echo "pokedex supprimé"

# create the ecotips DB and user,
createuser pokedex -P
echo "pokedex créé"
createdb pokedex -O pokedex
echo "BDD créée"

# delete the sqitch.conf and sqitch.plan files,
rm sqitch.conf
rm sqitch.plan

# initiate sqitch.
sqitch init pokedex --target db:pg:pokedex
echo "Sqitch initialisé"