<?php

namespace Guide\GuideBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RandonneType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('titre')->add('description',TextareaType::class)
            ->add('destination')
            ->add('date')
            ->add('prix',IntegerType::class)->add('nbr_places')->add('pointDepart')->add('type',ChoiceType::class,array(

                    'choices'=>array(
                        "camping"=>"camping", "escalade"=>"escalade","Spéléologie"=>"Spéléologie","Alpinisme"=>"Alpinisme",
                        "plongée"=>"plongée",   "chasse"=>"chasse","pêche"=>"pêche"
                    )))->add('niveau')->add('ageMin')
            ->add('moyenTransport')->add('plan') ->add('ajouter',SubmitType::class)  ;
    }
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Guide\GuideBundle\Entity\Randonne'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'randonnebundle_randonne';
    }


}
